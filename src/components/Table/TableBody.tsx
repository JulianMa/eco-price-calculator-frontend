import type { JSXElement } from 'solid-js';
type Props = {
  children: JSXElement;
};

export default (props: Props) => (
  <tbody class="divide-y divide-borderColor-primary">{props.children}</tbody>
);
