import React, { useState, useRef, useEffect } from "react";
import cn from "classnames";
import Select, { components } from "react-select";
import "./react-select.scss";

const selectStyles = {
  control: () => ({}),
  valueContainer: () => ({}),
  indicatorsContainer: () => ({}),
  dropdownIndicator: () => ({}),
  singleValue: () => ({}),
  menu: () => ({}),
  menuList: () => ({}),
  option: () => ({}),
  multiValue: () => ({}),
  placeholder: () => ({}),
};

const Placeholder = ({ ...props }) => {
  return <components.Placeholder className={"h5"} {...props} />;
};

const Option = ({ ...props }) => {
  return <components.Option className={"h5"} {...props} />;
};

const MultiOption = ({ label, isSelected, value, ...props }) => {
  return (
    <components.Option
      className={cn('h5', {
        "react-select__option--is-selected": isSelected,
        "react-select__option--hidden": value === '<CHOOSED_ALL>'
      })}
      {...props}
    >
      <div className={"react-select__multi-option"}>
        <input
          className="react-select__multi-option-input"
          type="checkbox"
          checked={isSelected}
          onChange={() => null}
        />
        <div className="react-select__multi-option-checkmark">
          <svg>
            <use href={`/assets/svg/sprite.svg#input-checkmark`}></use>
          </svg>
        </div>
        <label className="react-select__multi-option-label">{label}</label>
      </div>
    </components.Option>
  );
};

const MultiValue = ({ children }) => {
  return <span className={"react-select__multi-value h5"}>{children}</span>;
};

const MultiValueRemove = () => null;

const DropdownIndicator = ({ ...props }) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg>
        <use href={`/assets/svg/sprite.svg#select-dropdown`}></use>
      </svg>
    </components.DropdownIndicator>
  );
};

/**
 * Компонент селекта
 * @param {Object} props - Пропсы
 * @param {string=} props.className - Дополнительные классы
 * @param {Object[]} props.options - Варианты селекта
 * @param {boolean=} props.options.selected - Флаг выбранного вариант селекта в начале. Если в вариантах его нет, то отображается первый вариант.
 * @param {string} props.options.title - Название варианта селекта
 * @param {string} props.options.value - Значение варианта селекта для формы
 * @param {boolean=} props.isMulti - Флаг селекта с мультивыбором.
 * @param {string=} props.placeholder - Плейсхолдер селекта с мултивыбором
 * @param {string=} props.selectAll - Название варианта в мультиселекте, который выделяет все элементы
 * @param {number=} props.selectedOption - Значение выбранного варианта селекта. Если не указан, то отображается первый вариант
 * @param {(any) => void} [props.onChange] - Колбак функция, вызываемая при изменение варианта селекта.
 * @param {boolean=} props.sendAll - Флаг, показывающий, нужно ли отправлять пустой массив или все выбранные варианты, когда выбираешь все варианты
 */
const ReactSelect = ({
  className,
  options,
  isMulti,
  placeholder,
  selectAll,
  selectedOption,
  onChange,
  sendAll = true,
  ...props
}) => {
  let selectOptionsDataMod = [];
  if (Array.isArray(options)) {
    selectOptionsDataMod = options.map((object) => {
      return {
        ...object,
        label: object.title,
      };
    });
  }

  const [selectOptionsData, setSelectOptionsData] = useState(selectOptionsDataMod);

  let multiSelectedOptions = selectOptionsData.filter((object) => {
    return object.selected === true;
  });

  if (multiSelectedOptions.length === 0 && selectAll) {
    multiSelectedOptions = selectOptionsData;
  }

  const [selected, setSelected] = useState(multiSelectedOptions);
  const valueRef = useRef(selected);
  valueRef.current = selected;

  const selectAllOption = {
    value: "<SELECT_ALL>",
    label: selectAll,
  };

  const choosedAllOption = {
    value: "<CHOOSED_ALL>",
    label: "Все",
  };

  const isSelectAllSelected = () => valueRef.current.length === selectOptionsData.length;

  const isOptionSelected = (option) =>
    valueRef.current.some(({ value }) => value === option.value) ||
    isSelectAllSelected();

  const getOptions = () => selectAll ? [selectAllOption, ...selectOptionsData] : [choosedAllOption, ...selectOptionsData];

  const getValue = () => (isSelectAllSelected() && selectAll ? [selectAllOption] : isSelectAllSelected() ? [choosedAllOption] : selected);

  const multiChange = (newValue, actionMeta) => {
    const { action, option, removedValue } = actionMeta;

    let selectOrChoosedOption;
    if (selectAll) {
      selectOrChoosedOption = selectAllOption;
    } else {
      selectOrChoosedOption = choosedAllOption;
    }

    if (action === "select-option" && option.value === selectOrChoosedOption.value) {
      setSelected(selectOptionsData, actionMeta);

      if (typeof onChange === "function") {
        sendAll ?
        onChange(selectOptionsData.map((obj) => obj.value))
        :
        // Если мы нажали на вариант, который выделяет все варианты, то в форму отправляется пустой массив, чтобы не отправлять данные
        onChange([]);
      }
    } else if ((action === "deselect-option" && option.value === selectOrChoosedOption.value) || (action === "remove-value" && removedValue.value === selectOrChoosedOption.value)) {
      setSelected([], actionMeta);

      if (typeof onChange === "function") {
        onChange([]);
      }
    } else if (actionMeta.action === "deselect-option" && isSelectAllSelected()) {
      setSelected(
        selectOptionsData.filter(({ value }) => value !== option.value),
        actionMeta
      );

      if (typeof onChange === "function") {
        onChange(
          selectOptionsData
            .filter(({ value }) => value !== option.value)
            .map((obj) => obj.value)
        );
      }
    } else {
      setSelected(newValue || [], actionMeta);

      if (typeof onChange === "function") {
        sendAll ?
        onChange(newValue.map((obj) => obj.value) || [])
        :
        // Если все варианты выбраны, то в данные отправляется пустой массив, чтобы не отправлять их
        onChange(selectOptionsData.length !== newValue.length ? newValue.map((obj) => obj.value) || [] : []);
      }
    }
  };

  const handleChange = (choosedValue, actionMeta) => {
    setSelectValue(choosedValue);

    if (typeof onChange === "function") {
      onChange(choosedValue.value, actionMeta);
    }
  };

  const [selectValue, setSelectValue] = useState(
    selectedOption
      ? selectOptionsData?.find((option) => option.value === selectedOption)
      : selectOptionsData?.find((option) => option.selected)
  );

  useEffect(() => {
    let selectOptionsData = [];
    if (Array.isArray(options)) {
      selectOptionsData = options.map((object) => {
        return {
          ...object,
          label: object.title,
        };
      });
    }

    let multiSelectedOptions = selectOptionsData.filter((object) => {
      return object.selected === true;
    });

    if (multiSelectedOptions.length === 0 && selectAll) {
      multiSelectedOptions = selectOptionsData;
    }

    setSelectOptionsData(selectOptionsData);
    setSelected(multiSelectedOptions);
    setSelectValue(
      selectedOption
        ? selectOptionsData?.find((option) => option.value === selectedOption)
        : selectOptionsData.find((option) => option.selected)
    );
  }, [options, selectedOption]);

  return (
    <Select
      {...props}
      isMulti={isMulti}
      blurInputOnSelect={false}
      isOptionSelected={isMulti ? isOptionSelected : undefined}
      closeMenuOnSelect={!isMulti}
      onChange={isMulti ? multiChange : handleChange}
      value={isMulti ? getValue() : selectValue ? selectValue : ""}
      options={isMulti ? getOptions() : selectOptionsData}
      placeholder={placeholder}
      hideSelectedOptions={false}
      className={cn("react-select h5", className)}
      classNamePrefix="react-select"
      styles={selectStyles}
      isSearchable={false}
      components={{
        IndicatorSeparator: false,
        ClearIndicator: false,
        Placeholder,
        DropdownIndicator,
        Option: isMulti ? MultiOption : Option,
        MultiValue,
        MultiValueRemove,
      }}
    />
  );
};

export default ReactSelect;
