import { createMemo } from 'solid-js';
import Dropdown from '../Dropdown';

type Props = {
  level: number;
  onSelectLevel: (level: number) => void;
};

const levelOptions = Array.from(Array(7)).map((_, i) => ({
  value: i,
  text: 'Level ' + (i + 1),
}));

export default (props: Props) => {
  return (
    <Dropdown
      value={props.level}
      values={levelOptions}
      onChange={(newValue) => props.onSelectLevel(Number(newValue))}
    />
  );
};
