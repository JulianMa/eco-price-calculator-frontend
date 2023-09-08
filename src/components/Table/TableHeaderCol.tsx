import classNames from 'classnames';
import type { JSXElement } from 'solid-js';
import Styles from './TableHeaderCol.module.css';

type Props = {
  children: JSXElement;
  onSort?: () => void;
  directionDesc?: boolean;
};

export default (props: Props) => (
  <th
    scope="col"
    class="text-textColor px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap"
  >
    {!props.onSort && props.children}
    {props.onSort && (
      <a
        onClick={props.onSort}
        class={classNames(Styles.sortableLink, {
          [Styles.sorted]: props.directionDesc !== undefined,
        })}
      >
        {props.children}
        <div class={Styles.sortIcon}>
          {/* Unsorted icon from https://iconmonstr.com/sort-2-svg/ */}
          {props.directionDesc === undefined && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3.202l3.839 4.798h-7.678l3.839-4.798zm0-3.202l-8 10h16l-8-10zm3.839 16l-3.839 4.798-3.839-4.798h7.678zm4.161-2h-16l8 10 8-10z" />
            </svg>
          )}

          {/* Sort desc icon from https://iconmonstr.com/sort-3-svg/ */}
          {props.directionDesc === true && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3.202l3.839 4.798h-7.678l3.839-4.798zm0-3.202l-8 10h16l-8-10zm8 14h-16l8 10 8-10z" />
            </svg>
          )}

          {/* Sort asc icon from https://iconmonstr.com/sort-4-svg/ */}
          {props.directionDesc === false && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0l-8 10h16l-8-10zm3.839 16l-3.839 4.798-3.839-4.798h7.678zm4.161-2h-16l8 10 8-10z" />
            </svg>
          )}
        </div>
      </a>
    )}
  </th>
);
