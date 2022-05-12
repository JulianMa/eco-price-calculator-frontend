import itemUrlMap from '../../assets/itemurlmap.json';
import { JSX } from 'solid-js';

type Props = {
  Name: string;
  class?: string;
  style?: JSX.CSSProperties;
};
export default (props: Props) => {
  return (
    <img src={(itemUrlMap as any)[props.Name] ? (itemUrlMap as any)[props.Name] : "https://wiki.play.eco/images/5/51/NoImage.png"} class={props.class} style={props.style}/>
  )
}

