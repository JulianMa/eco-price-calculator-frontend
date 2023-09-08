import { createSignal, JSXElement, onCleanup, onMount } from 'solid-js';
import styles from './Tooltip.module.css';
import PortalMenuPosition, {
  CardinalPoint,
} from '../PortalMenuPosition/PortalMenuPosition';
import classNames from 'classnames';
type Props = {
  text: string;
  children: JSXElement;
  origin?: CardinalPoint;
  direction?: CardinalPoint;
  noStyle?: boolean;
};
export default (props: Props) => {
  let el: any;
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  onMount(() => {
    el?.addEventListener('mouseenter', openMenu, false);
    el?.addEventListener('mouseleave', closeMenu, false);
  });
  onCleanup(() => {
    el?.removeEventListener('mouseenter', openMenu);
    el?.removeEventListener('mouseleave', closeMenu);
  });
  return (
    <PortalMenuPosition
      isMenuOpen={isMenuOpen}
      renderMenu={() => (
        <>
          <div class="bg-bgColor-secondary text-textColor-secondary mb-1 inline-block font-medium shadow-sm py-2 px-3 text-sm rounded-lg">
            {props.text}
          </div>
        </>
      )}
      origin={props.origin ?? 'N'}
      direction={props.direction ?? 'N'}
      class="z-50"
    >
      <div class="inline-block relative" ref={el}>
        <div
          class={classNames({
            ['bg-bgColor-primary hover:bg-bgColor-primary-hover text-textColor border-borderColor-primary hover:border-borderColor-hover text-sm border rounded inline-block border-dashed']:
              !props.noStyle,
          })}
        >
          {props.children}
        </div>
        {isMenuOpen() && <div class={styles.tooltipArrow}></div>}
      </div>
    </PortalMenuPosition>
  );
};
