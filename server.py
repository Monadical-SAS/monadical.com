#!/usr/bin/env python3

import os
import sys
import json
import subprocess
from threading import Thread
from datetime import datetime

from jinja2 import Markup
from flask import Flask, render_template, redirect


### Config
app = Flask(__name__)
app.jinja_env.globals['include_raw'] = lambda filename: Markup(app.jinja_loader.get_source(app.jinja_env, filename)[0])
CONFIG_FILE = 'content.json'
HOST = 'http://127.0.0.1:5000'

def load_config(fname=CONFIG_FILE):
    """read the content.json file and load it as a dictionary"""
    with open(fname, 'r') as f:
        return json.load(f)

def download_post(post):
    CMD = [
        "/usr/local/bin/wget",
        "--convert-links",
        "--output-document",
        os.path.join('templates', post['template']),
        post['source'],
    ]
    proc = subprocess.run(CMD, capture_output=True)


CONFIG = load_config(CONFIG_FILE)

PAGES = {page['url']: page for page in  list(CONFIG['PAGES'].values())}  # {url: {page_data}}
POSTS = {post['url']: post for post in  list(CONFIG['POSTS'].values())}  # {url: {post_data}}


### Routes

# Similar to wordpress, pages and posts are separate.  Every page has its own template
# in templates/page.html, but all posts use the same template + an iframe URL for the
# post content

@app.route('/')
def index():
    return redirect("/index.html")

@app.route('/favicon.ico')
def favicon():
    return redirect("/static/favicon.ico")

@app.route('/<path>')
def render_page(path):
    page = PAGES[f'/{path}']
    return render_template(page['template'], now=datetime.now(), **CONFIG, **page)

@app.route('/posts/<path>')
def render_post(path):
    post = POSTS[f'/posts/{path}']
    # if os.path.exists(os.path.join('templates', post['template'])):
    #     thread = Thread(target=download_post, args=(post,))
    #     thread.start()
    # else:
    #    download_post(post)
    download_post(post)
    return render_template('post.html', now=datetime.now(), **CONFIG, **post)

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--pages':
        # just print list of page urls
        print('\n'.join(HOST + url for url in PAGES.keys()))
    elif len(sys.argv) > 1 and sys.argv[1] == '--posts':
        # just print list of post urls
        print('\n'.join(HOST + url for url in POSTS.keys()))
    else:
        # run the flask http server
        app.run()
