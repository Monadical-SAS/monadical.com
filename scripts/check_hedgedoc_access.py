#!/usr/bin/env python3
"""
@vibe-coded
Script to extract HedgeDoc URLs from content.json and check their permission labels
"""

import re
import sys
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

def extract_hedgedoc_urls(content_file):
    """Extract all HedgeDoc URLs from content.json"""
    try:
        with open(content_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"FATAL ERROR: Could not read {content_file}: {e}")
        sys.exit(1)
    
    # Find all HedgeDoc URLs
    pattern = r'https://docs\.monadical\.com/s/[^"\s]+'
    urls = re.findall(pattern, content)
    
    if not urls:
        print("FATAL ERROR: No HedgeDoc URLs found in content.json")
        sys.exit(1)
    
    # Remove duplicates and sort
    return sorted(set(urls))

async def check_permission_label(url, max_retries=3):
    """Check the permission label for a given HedgeDoc URL with retry logic"""
    # Convert /s/ URL to direct URL by removing /s/
    direct_url = url.replace('/s/', '/')
    
    for attempt in range(max_retries):
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch()
                page = await browser.new_page()
                
                # Set realistic user agent to avoid being detected as a crawler
                await page.set_extra_http_headers({
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                })
                
                try:
                    if attempt == 0:
                        print(f"Original URL: {url}")
                        print(f"Checking direct URL: {direct_url}")
                    else:
                        print(f"Retry {attempt} for: {url}")
                    
                    await page.goto(direct_url, wait_until='networkidle', timeout=30000)
                    
                    # Wait for the permissionLabel element to appear
                    permission_element = await page.wait_for_selector('#permissionLabel', timeout=10000)
                    if not permission_element:
                        raise Exception("permissionLabel element not found")
                    
                    permission_text = await permission_element.text_content()
                    if not permission_text:
                        raise Exception("permissionLabel element has no text content")
                    
                    await browser.close()
                    return url, permission_text.strip()
                    
                except Exception as e:
                    await browser.close()
                    if attempt < max_retries - 1:
                        # Exponential backoff: 2^attempt seconds
                        wait_time = 2 ** attempt
                        print(f"Attempt {attempt + 1} failed for {url}, retrying in {wait_time}s: {str(e)}")
                        await asyncio.sleep(wait_time)
                        continue
                    else:
                        # Final attempt failed, return error instead of raising
                        return url, f"FAILED: {str(e)}"
                        
        except Exception as e:
            if attempt == max_retries - 1:
                # Return failure instead of raising to continue processing
                return url, f"FAILED: {str(e)}"
            continue

async def check_url_with_semaphore(semaphore, url):
    """Check a single URL with semaphore control"""
    async with semaphore:
        return await check_permission_label(url)

async def main():
    content_file = Path(__file__).parent / "content.json"
    
    if not content_file.exists():
        print(f"FATAL ERROR: {content_file} not found!")
        sys.exit(1)
    
    print("Extracting HedgeDoc URLs from content.json...")
    urls = extract_hedgedoc_urls(content_file)
    
    print(f"Processing all {len(urls)} URLs with max 15 concurrent requests...")
    print("=" * 80)
    
    # Create semaphore for 15 concurrent requests
    semaphore = asyncio.Semaphore(15)
    
    # Process all URLs concurrently
    tasks = [check_url_with_semaphore(semaphore, url) for url in urls]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Filter for URLs containing "free" (case insensitive) and track failures
    free_urls = []
    failed_urls = []
    
    print("Processing results...")
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            print(f"UNEXPECTED ERROR processing {urls[i]}: {result}")
            failed_urls.append((urls[i], str(result)))
            continue
            
        url, permission_label = result
        
        if permission_label.startswith("FAILED:"):
            print(f"FAILED URL: {url} -> {permission_label}")
            failed_urls.append((url, permission_label))
        elif "free" in permission_label.lower():
            print(f"FREE URL: {url} -> Permission: {permission_label}")
            free_urls.append(url)
    
    print("\n" + "=" * 80)
    print(f"Found {len(free_urls)} URLs with 'free' in permission label:")
    print("=" * 80)
    
    for url in free_urls:
        print(url)
    
    if failed_urls:
        print("\n" + "=" * 80)
        print(f"Found {len(failed_urls)} FAILED URLs:")
        print("=" * 80)
        
        for url, error in failed_urls:
            print(f"{url} -> {error}")
        
        print(f"\nScript completed with {len(failed_urls)} failures")
        sys.exit(1)
    
    return free_urls

if __name__ == "__main__":
    asyncio.run(main())