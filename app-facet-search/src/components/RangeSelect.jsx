import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import React, { useState } from "react";
import Select from "react-select";
import FacetSearch from "../App.js"

function RangeSelect({ values, name, labels }) {
  function handleChange(params) {
    let searchUrl = "";
    if (search.indexOf("&") >= 0) {
      let arrSearch = search.split("&");
      for (let i = 0; i < arrSearch.length; i++) {
        if (arrSearch[i].indexOf(encodeURIComponent(name) + "=") < 0) {
          searchUrl += "&" + arrSearch[i];
        }
      }
      //Delete "&" in First element
      searchUrl = searchUrl.substring(1);
    }
    if (searchUrl != "") {
      search = searchUrl;
    }
    
    params.map(function (subitem, k) {
      const pattern =
          encodeURIComponent(name) + "=" + encodeURIComponent(subitem.value);
      search += "&" + pattern;
    });
    search = search.replace("q=0", "q=");
    search += search.indexOf('is_facet_search=') == -1 ? '&is_facet_search=true' : '';
    if(sessionStorage.getItem('init_detail_condition')){
      sessionStorage.setItem('btn', 'detail-search');
    }   
    window.location.href = "/search" + search;
  }

  let search = window.location.search.replace(",", "%2C") || "?";
  let params = window.location.search.substring(1).split('&');
  for (let i = 0; i < params.length; i++) {
    params[i] = decodeURIComponent(params[i]);
  }
  let defaultOptions = [];
  let options = [];  
  if(values){
    values.map(function (subitem, k) {
      let option = {
        label: (labels[subitem.name] || subitem.name) + "(" + subitem.count + ")",
        value: subitem.name
      };
      options.push(option);
      let pattern = name + "=" + subitem.name;
      if (params.indexOf(pattern) != -1) {
        defaultOptions.push(option);
      }
    });
  }

  let [stateOptions, setOptions] = useState(options);
  let [stateDefaultOptions, setdefaultOptions] = useState(defaultOptions);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const FacetSearchInstance = new FacetSearch();
  const containsString = params.some(item => item.includes(name));

  const loadOptions = () => {
      if (isFirstClick) {
        setIsFirstClick(false);
        if (!containsString){
          FacetSearchInstance.get_facet_search_list(name)
          .then((result) => {
            let list_facet = result
            const values = list_facet[name];
            let options = [];
            if (values) {
              values.map(function (subitem, k) {
                let option = {
                  label: (labels[subitem.name] || subitem.name) + "(" + subitem.count + ")",
                  value: subitem.name
                };
                options.push(option);
              });
            }
            setOptions(options);
          })
          .catch((error) => {
            console.error('Error occurred:', error);
          });
          }
      }
  };
  
  return (
    <div>
      <div className="select-container">
        <Select
          defaultValue={stateDefaultOptions}
          isMulti
          name="Facet_Search"
          ontrolShouldRenderValue={false} 
          onChange={(_selectedOption) => {
            handleChange(_selectedOption);
          }}
          backspaceRemovesValue={false}
          isClearable={false}
          options={stateOptions}
          onMenuOpen={loadOptions}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
    </div>
  );
}

export default RangeSelect;
