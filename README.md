# Autocomplete

Autocomplete is a component for input autocompletion and can be used as an element of UI kit.

Stack: `React` + `TypeScript`

## Demo
https://mscbr.github.io/autocomplete/
*for presentational purpose connected to "Rick & Morty API"

## v1 Autocomplete Docs

Autocomplete suggestions input component. Provides useful hints based on user input value.

Required props:

- `value` string
- `label` string
- `onChange` function handling input changes
- `suggestions` array of strings, data for autocomplete list

Optional props:

- `placeholder` string
- `isLoading` boolean - triggers the loading spinner
- `sort` boolean - if true suggestions will be sorted alphabetically
