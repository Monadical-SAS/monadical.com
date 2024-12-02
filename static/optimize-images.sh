#!/bin/bash

MAX_SIZE=600  # KB

MAX_DIMENSION=600

# Ensure ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it first:"
    echo "brew install imagemagick"
    exit 1
fi

# Find and process large image files in the current directory only
for file in *.[jJ][pP][gG] *.[pP][nN][gG] *.[jJ][pP][eE][gG]; do
    # Skip if file doesn't exist
    [ -f "$file" ] || continue

    # Skip if already an _orig file
    [[ "$file" == *_orig.* ]] && continue

    # Check size
    size=$(stat -f %z "$file")
    if (( size > MAX_SIZE * 1024 )); then
        # Prompt
        while true; do
            read -p "Optimize $file? (y/n): " answer
            case $answer in
                [Yy]*)
                    # Create backup
                    orig_filename="${file%.*}_orig.${file##*.}"
                    cp "$file" "$orig_filename"

                    # Optimize
                    convert "$file" \
                        -strip \
                        -interlace Plane \
                        -quality 75 \
                        -resize "${MAX_DIMENSION}x${MAX_DIMENSION}>" \
                        "$file"
                    echo "Optimized $file"
                    break
                    ;;
                [Nn]*)
                    echo "Skipped $file"
                    break
                    ;;
                *)
                    echo "Please answer y or n."
                    ;;
            esac
        done
    fi
done

echo "Image optimization complete!"