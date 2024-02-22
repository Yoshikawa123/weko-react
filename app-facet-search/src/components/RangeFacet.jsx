import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import React, { useState } from "react";
import { Collapse } from "reactstrap";
import RangeSelect from "./RangeSelect";
import RangeSlider from "./RangeSlider";
import RangeCheckboxList from "./RangeCheckboxList";

function RangeFacet({ item, nameshow, name, key, labels, isInitOpen, uiType, displayNumber }) {
  const toggle = () => setIsOpen(!isOpen);
  const search = window.location.search.replace(",", "%2C");
  const is_check = search.indexOf(encodeURIComponent(name)) >= 0 ? true : isInitOpen;
  const [isOpen, setIsOpen] = useState(is_check);
  const isRecordsPath = window.location.pathname.split('/')[1].includes('records');
  let params = window.location.search.substring(1).split('&');
  for (let i = 0; i < params.length; i++) {
    params[i] = decodeURIComponent(params[i]);
  }
  if(!(item === undefined)){
    if(item.length == 0){
      let noResultsItem = []
      const regex = new RegExp(name);
      params.forEach(value => {
          if (regex.test(value)) {
              let option = {
                name: value.split('=')[1],
                count: 0
              };
              noResultsItem.push(option);
          }
      });
      item = noResultsItem
    }
  }
  return (
    <div className="panel panel-default" key={key}>
      <div className="panel-heading clearfix">
        <h3 className="panel-title pull-left">{nameshow}</h3>
          <a className="pull-right" onClick={toggle}>
          {!isOpen && (
            <span>
              <i className="glyphicon glyphicon-chevron-right"></i>
            </span>
          )}
          {isOpen && (
            <span>
              <i className="glyphicon glyphicon-chevron-down"></i>
            </span>
          )}
        </a>
      </div>
      <Collapse isOpen={isOpen}>
        <div className="panel-body index-body">
          {uiType === "SelectBox" && !isRecordsPath && (
            <RangeSelect values={item} name={name} labels={labels} />
          )}
          {item != null && !isRecordsPath && uiType === "CheckboxList" &&  (
            <RangeCheckboxList values={item} name={name} labels={labels} displayNumber={displayNumber} />
          )}
          {item != null && !isRecordsPath && uiType === "RangeSlider" && (
            <RangeSlider value={item} name={name} labels={labels} />
          )}
        </div>
      </Collapse>
    </div>
  );
}

export default RangeFacet;
