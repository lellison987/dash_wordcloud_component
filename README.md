# dash-wordcloud-component

dash-wordcloud-component is a Dash component library.

Get started with:
1. Install Dash and its dependencies: https://dash.plot.ly/installation
2. Run `python usage.py`
3. Visit http://localhost:8050 in your web browser

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

### Install dependencies

1. Install npm packages
    ```
    $ npm install
    ```
2. Create a virtual env and activate.
    ```
    $ virtualenv venv
    $ . venv/bin/activate
    ```
    _Note: venv\Scripts\activate for windows_

3. Install python packages required to build components.
    ```
    $ pip install -r requirements.txt
    ```
4. Install the python packages for testing (optional)
    ```
    $ pip install -r tests/requirements.txt
    ```

### Create a production build and publish:

1. Build your code:
    ```
    $ npm run build:all
    ```
2. Create a Python tarball
    ```
    $ python setup.py sdist
    ```
    This distribution tarball will get generated in the `dist/` folder

3. Test your tarball by copying it into a new environment and installing it locally:
    ```
    $ mv dist/dash_wordcloud_component-0.0.1.tar.gz <your path>/.local/lib/python3.7/site-packages
    $ cd <your path>/.local/lib/python3.7/site-packages
    $ pip install dash_wordcloud_component-0.0.1.tar.gz
    ```

4. You should now be able to import the component as dash_wordcloud_component like in [usage.py](./usage.py)
