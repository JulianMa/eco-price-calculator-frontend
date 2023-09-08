import { useMainContext } from '../../hooks/MainContext';

export default () => {
  const { mainState, update } = useMainContext();
  return (
    <input
      class="bg-bgColor-primary hover:bg-bgColor-primary-hover rounded-md border h-8 px-2 text-sm font-small focus:outline-none text-textColor border-borderColor-primary hover:border-borderColor-hover"
      type="search"
      placeholder="User name"
      value={mainState.userName}
      onChange={(ev) => update.userName(ev.currentTarget.value)}
    />
  );
};
