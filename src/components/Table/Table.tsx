import type { JSXElement } from 'solid-js';

type Props = {
  children: JSXElement;
};

export default (props: Props) => (
  <div class="flex flex-col flex-grow">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="text-textColor border-borderColor-primary shadow overflow-hidden border sm:rounded-lg">
          <table class="min-w-full divide-y divide-borderColor-primary">
            {props.children}
          </table>
        </div>
      </div>
    </div>
  </div>
);
