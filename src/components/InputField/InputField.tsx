import type { ComponentProps } from "react";
import {
  Input,
  InputGroup,
  InputGroupText,
} from 'reactstrap';

type Props = {
  label: string;
  value: ComponentProps<typeof Input>['value'];
  onChange: (newValue: string) => void;
  displayAfter?: string;
  type: ComponentProps<typeof Input>['type'];
  disabled?: boolean;
  step?: number;
};

const InputField = ({
  label,
  value,
  onChange,
  displayAfter,
  disabled,
  step,
  type,
}: Props) => (
  <InputGroup>
    <InputGroupText>{label}</InputGroupText>
    <Input
      step={step}
      disabled={disabled}
      type={type}
      value={value}
      onChange={({ target: { value } }) => {
        onChange(value);
      }}
    />
    {displayAfter && <InputGroupText>{displayAfter}</InputGroupText>}
  </InputGroup>
);

export default InputField;
