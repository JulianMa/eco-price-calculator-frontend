import classNames from 'classnames';
import type { JSXElement } from 'solid-js';

type Props = {
  children: JSXElement;
  onClick: () => void;
  class?: string;
};
export default (props: Props) => (
  <button
    class={classNames(
      'bg-bgColor-primary hover:bg-bgColor-primary-hover text-textColor border-borderColor-primary hover:border-borderColor-hover text-sm font-semibold py-1 px-2 border rounded',
      props.class ?? ''
    )}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);
