# [Monadical](https://monadical.com)

Simple static site powering Monadical.com.

Static HTML is produced using a short custom website generator powered by Flask, Jinja2, & wget.
  
All metadata is stored in `content.json`.  
Templates are in: `templates/`  
Static files are in: `static/`  

## Install

```bash
brew install wget python3  # only needed on mac
pip3 install flask
```

## Common Tasks

### Adding a new Post

1. upload post as markdown to https://docs.oddslingers.com
2. click "Publish", and get the public url, like `https://docs.oddslingers.com/s/Skcz_hUhM`
3. edit `content.json` to add metadata for new post, including public url
4. rebuild site
5. new post should appear on articles page

### Adding a new Page

1. edit 'content.json' to add metadata for new page, including url
2. add new template `html` file to `templates/`
3. add link to new page in navbar: see `base.html` `<nav>` section
4. rebuild site
5. new page should appear in navbar


### Editing existing Post/Page

1. edit 'content.json' to reflect new metadata
2. edit any relevant templates
3. rebuild site
4. new page should appear in navbar

### Editing header/footer/other code

1. edit `base.html`, `static/main.css`, `content.json` and any other relevant templates
2. rebuild site
3. new changes should appear on site

## Command Line Interface

### Run the Server

```bash
./server
# or with auto-reloading
env FLASK_DEBUG=True ./server
```

### Get a list of the page & post urls without running the server

```bash
./server --pages
./server --posts
```

### Build the Static Site

```bash
./build
```
Static HTMML output will be produced in `output/`, and can be rsyned to a server using build script or manually with:

`rsync -r output/ monadical.com:/opt/monadical.com/output`

## Stack

The static site generator is build using Flask + Jinja2 and wget to save the output as static html.
