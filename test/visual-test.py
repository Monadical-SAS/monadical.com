from http.server import HTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from selenium.webdriver import Firefox, FirefoxOptions
from selenium.webdriver.common.keys import Keys
from percy import percy_snapshot
from functools import partial



# # start monadical webpage in another thread
Handler = partial(SimpleHTTPRequestHandler, directory='./docs')
httpd = HTTPServer(('localhost', 8000), Handler)
thread = Thread(target=httpd.serve_forever)
thread.setDaemon(True)
thread.start()

# launch firefox headless
ff_options = FirefoxOptions()
ff_options.add_argument('-headless')
browser = Firefox(options=ff_options)

# go to the main page
browser.get('http://localhost:8000')
browser.implicitly_wait(10)
# percy_snapshot(browser, 'Main page')

# go to the principles page
browser.get('http://localhost:8000/principles.html')
browser.implicitly_wait(10)
# percy_snapshot(browser, 'Principles page')

# go to the portfolio page
browser.get('http://localhost:8000/portfolio.html')
browser.implicitly_wait(10)
# percy_snapshot(browser, 'Portfolio page')

# go to the team page
browser.get('http://localhost:8000/team.html')
browser.implicitly_wait(10)
# percy_snapshot(browser, 'Team page')

# go to the blog main page
browser.get('http://localhost:8000/blog.html')
browser.implicitly_wait(10)
# percy_snapshot(browser, 'Blog main page')

# go to the LY page
browser.get('http://localhost:8000/yak.html')
browser.implicitly_wait(10)
# percy_snapshot(browser, 'Lightning yak page')

# clean up
browser.quit()
httpd.shutdown()