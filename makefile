VENV=.venv/bin
NPM=node_modules/.bin
REQUIREMENTS=$(wildcard requirements.txt)
MARKER=.initialized-with-makefile
VENVDEPS=$(REQUIREMENTS setup.py)
NPMDEPS=$(package-lock.json)

$(VENV):
	python -m venv .venv
	$(VENV)/python -m pip install --upgrade pip

$(VENV)/$(MARKER): $(VENVDEPS) | $(VENV)
	$(VENV)/pip install $(foreach path,$(REQUIREMENTS),-r $(path))
	touch $(VENV)/$(MARKER)

$(NPM): $(NPMDEPS)
	npm install

.PHONY: venv npm install clean serve test

venv: $(VENV)/$(MARKER)
npm: $(NPM)

install: npm venv

clean:
	rm -rf $$(cat .gitignore)

serve-flask:
	env FLASK_DEBUG=True ./server

serve:
	$(VENV)/python -m http.server 8000 -d docs

test: install
	$(NPM)/percy exec -- $(VENV)/python test/visual-test.py



