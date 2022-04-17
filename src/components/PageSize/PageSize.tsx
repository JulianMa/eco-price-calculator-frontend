import { Show } from 'solid-js';
import Dropdown from '../Dropdown';

type Props = {
  pageSize: number;
  onChange: (value: number) => void;
};
export default (props: Props) => (
  <Dropdown
    value={props.pageSize}
    values={[
      { value: 10, text: '10 rows' },
      { value: 20, text: '20 rows' },
      { value: 50, text: '50 rows' },
      { value: 100, text: '100 rows' },
      { value: 200, text: '200 rows' },
      { value: 1000, text: '1000 rows' },
    ]}
    onChange={(value) => props.onChange(Number(value))}
    origin="SE"
    direction="SW"
  />
);
