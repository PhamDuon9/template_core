import React from 'react';

interface InputFormProps {
  valueInput: number;
  onChange?: (value: number) => void;
}

const NotNegativeNumber: React.FC<InputFormProps> = (props) => {
  const { valueInput, onChange } = props;

  const changeV = (value: number) => {
    value = Math.abs(value);
    const maxLength = import.meta.env.VITE_MAX_LENGTH_INPUT_NUMBER;
    const newValue = value.toString().length < maxLength ? value : parseInt(value.toString().substring(0, maxLength));
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const [value, setValue] = React.useState(valueInput);

  return (
    <>
      <input
        type='number'
        min='0'
        required
        step='1'
        className='ant-input'
        value={value && Math.max(0, value)}
        onChange={(e) => changeV(Number(e.target.value))}
      />
    </>
  );
};

export default NotNegativeNumber;
