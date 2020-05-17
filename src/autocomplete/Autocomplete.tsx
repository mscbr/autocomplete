import React, { useState, useEffect, useRef } from "react";
import "./Autocomplete.css";

interface Props {
  value: string;
  label: string;
  placeholder?: string;
  onChange: (val: string) => void;
  suggestions: string[];
  isLoading?: boolean;
  sort?: boolean;
}
const Autocomplete: React.FC<Props> = props => {
  
  const {
    value,
    label,
    onChange,
    suggestions,
    isLoading,
    sort
    // placeholder is used as props.placeholder
  } = props;

  // assigning placeholder's value from a prop
  const [placeholder, setPlaceholder] = useState(() => props.placeholder || "");
  // which of suggestions is currently selected
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  // array of data filtered out based on current input value
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // id for associating label/input - it can be changed to id assignment from parent
  const inputId = `id-${Math.floor(Date.now() / 1000)}`;
  // ref for text-input
  const textInputRef = useRef<HTMLInputElement>(null);
  // ref for suggestions list
  const listRef = useRef<HTMLUListElement>(null);

  const suggestionFiltering = (suggestionArr: string[], filterVal: string) => {
    return suggestionArr.filter((suggestion, ind, arr) => {
      // regexp is matching the exact value from the beginning
      // .replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") - escaping special characters
      const regex = new RegExp(
        `^${filterVal.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")}`,
        "i"
      );

      // return suggestion if:
      // is input value
      // input value !== suggestion
      // + do not display duplicated suggestion
      return filterVal &&
        filterVal.toLowerCase() !== suggestion.toLowerCase() &&
        arr.indexOf(suggestion) == ind
        ? regex.test(suggestion)
        : "";
    });
  };

  // wrapper function in order to handle <HTMLInputElement> ChangeEvent type
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (val: string) => void
  ) => {
    return callback(e.target.value);
  };

  // handling click events inside <ul>/<li>
  const onClick = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent> | MouseEvent,
    callback: (val: string) => void
  ) => {
    if (
      filteredSuggestions[activeSuggestion] &&
      listRef.current &&
      listRef.current.contains(e.target as Node)
    ) {
      // inside suggestions <ul> click
      const targetSuggestion = filteredSuggestions[activeSuggestion];
      setActiveSuggestion(0);
      setFilteredSuggestions([]);

      return callback(targetSuggestion);
    } else if (listRef.current && !listRef.current.contains(e.target as Node)) {
      // handling case if click event is outside of autocomplte suggestions <ul>
      setActiveSuggestion(0);
      setFilteredSuggestions([]);
    }
  };

  const onKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    callback: (val: string) => void
  ) => {
    // handling KeyboardEvents from text input element
    // autocomplete <ul> is only active with foccused target text input
    switch (e.keyCode) {
      case 38:
        // arrow up
        e.preventDefault();
        return setActiveSuggestion(
          activeSuggestion - 1 >= 0
            ? activeSuggestion - 1
            : filteredSuggestions.length - 1
        );
      case 40:
        // arrow down
        e.preventDefault();
        return setActiveSuggestion(
          activeSuggestion + 1 > filteredSuggestions.length - 1
            ? 0
            : activeSuggestion + 1
        );
      case 13:
      case 39:
        // enter & arrow right
        if (filteredSuggestions[activeSuggestion]) {
          const targetSuggestion = filteredSuggestions[activeSuggestion];
          setActiveSuggestion(0);
          setFilteredSuggestions([]);

          return callback(targetSuggestion);
        }
        return;
      case 9:
        // tab
        e.preventDefault();
        if (filteredSuggestions[activeSuggestion]) {
          const targetSuggestion = filteredSuggestions[activeSuggestion];
          setActiveSuggestion(0);
          setFilteredSuggestions([]);

          return callback(targetSuggestion);
        }
        // returning false in order to prevent default in IE
        return false;
      case 27:
        // esc
        setActiveSuggestion(0);
        return setFilteredSuggestions([]);
      default:
        return;
    }
  };

  // handling clicking outside of suggestion <ul>
  useEffect(() => {
    document.addEventListener("mousedown", (e: MouseEvent) =>
      onClick(e, onChange)
    );
    // cleanup
    return () => {
      document.removeEventListener("mousedown", (e: MouseEvent) =>
        onClick(e, onChange)
      );
    };
  }, []);

  // filtering data on props values change - suggestions, value, sort
  useEffect(() => {
    if (sort) {
      // if sort === true, apply ascending alphabetical sorting
      setFilteredSuggestions(
        suggestionFiltering(
          [...suggestions].sort((a, b) => a.localeCompare(b)),
          value
        )
      );
    } else {
      setFilteredSuggestions(suggestionFiltering(suggestions, value));
    }
  }, [suggestions, value, sort]);

  return (
    <>
      <div className="autocomplete-wrapper">
        <div className="autocomplete-text-input-wrapper">
          <label htmlFor={inputId} className="autocomplete-text-input-label">
            {label || "Label"}
          </label>
          <input
            id={inputId}
            ref={textInputRef}
            className="autocomplete-text-input"
            type="text"
            value={value}
            onChange={e => handleChange(e, onChange)}
            onKeyDown={e => onKeyDown(e, onChange)}
            onBlur={() => {
              // seting back placeholder to the initial value
              return setPlaceholder(props.placeholder || "");
            }}
          />
          <span
            className="autocomplete-input-placeholder"
            onClick={() => {
              setPlaceholder("");
              return textInputRef.current && textInputRef.current.focus();
            }}
          >
            {/* displaying placeholder logic
                        if not value placeholder then placeholder
                        else if selected suggestion then input value + active suggestion slice
                        else ''
                    */}
            {!value && placeholder
              ? placeholder
              : filteredSuggestions[activeSuggestion]
              ? value +
                filteredSuggestions[activeSuggestion].slice(value.length)
              : ""}
          </span>
          {/* if isLoading display loading spinner */}
          {isLoading && <div className="loader"></div>}
        </div>
        {filteredSuggestions && !isLoading && (
          <div className="autocomplete-list-wrapper">
            <ul
              ref={listRef}
              // inline handling of long suggestions list
              style={
                filteredSuggestions.length > 8
                  ? { height: 300, overflow: "auto" }
                  : {}
              }
            >
              {filteredSuggestions.map((suggestion, ind) => (
                <li
                  className={`${
                    ind === activeSuggestion ? "active-suggestion" : ""
                  }`}
                  onClick={e => onClick(e, onChange)}
                  onMouseOver={() => setActiveSuggestion(ind)}
                  key={`${suggestion}${ind}`}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Autocomplete;
