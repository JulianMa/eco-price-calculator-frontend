import type { JSXElement } from 'solid-js';
type Props = {
  children: JSXElement;
};

export default (props: Props) => (
  <thead class="bg-bgColor-primary-hover">
    <tr>{props.children}</tr>
  </thead>
);
