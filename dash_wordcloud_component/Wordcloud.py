# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class Wordcloud(Component):
    """A Wordcloud component.
Wordcloud is a wordcloud component.
It takes in a text with words separated
by spaces and turns it into a cloud of
randomly placed words.

Much of this code is taken from or inspired by: https://codepen.io/stevn/pen/JdwNgw

Keyword arguments:
- id (string; optional): The ID used to identify this component in Dash callbacks
- className (string; optional)
- minFontSize (number; optional)
- maxFontSize (number; optional)
- font (string; optional)
- text (string; optional)
- style (dict; optional)
- loading_state (optional): . loading_state has the following type: dict containing keys 'is_loading', 'prop_name', 'component_name'.
Those keys have the following types:
  - is_loading (boolean; optional)
  - prop_name (string; optional)
  - component_name (string; optional)"""
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, className=Component.UNDEFINED, minFontSize=Component.UNDEFINED, maxFontSize=Component.UNDEFINED, font=Component.UNDEFINED, text=Component.UNDEFINED, style=Component.UNDEFINED, loading_state=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'className', 'minFontSize', 'maxFontSize', 'font', 'text', 'style', 'loading_state']
        self._type = 'Wordcloud'
        self._namespace = 'dash_wordcloud_component'
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'className', 'minFontSize', 'maxFontSize', 'font', 'text', 'style', 'loading_state']
        self.available_wildcard_properties =            []

        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}

        for k in []:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')
        super(Wordcloud, self).__init__(**args)
