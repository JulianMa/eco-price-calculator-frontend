import classNames from 'classnames';
import {formatNumber} from '../../utils/helpers';
import Styles from './NumericInput.module.css';

type Props = {
    value?: number;
    onChange: (newValue: number) => void;
    onSaveValueToEco: (newValue: number) => void;
    class?: string;
};

export default (props: Props) => {
    return (
        <div
            class={classNames(
                Styles['custom-number-input'],
                'flex flex-row h-8 w-24 rounded-md',
                props.class
            )}
        >
            <button
                data-action="decrement"
                className="bg-bgColor-primary hover:bg-bgColor-primary-hover text-textColor border-borderColor-primary hover:border-borderColor-hover border w-10 rounded-l cursor-pointer outline-none"
                onClick={() => props.onChange(formatNumber((props.value ?? 0) - 1))}
            >
                <span className="m-auto text-1xl font-thin">−</span>
            </button>
            <input
                type="number"
                class="bg-bgColor-primary hover:bg-bgColor-primary-hover text-textColor border-borderColor-primary hover:border-borderColor-hover text-center w-full border-t border-b font-semibold text-md outline-none"
                name="custom-input-number"
                value={props.value ?? ''}
                onChange={(ev) =>
                    props.onChange(formatNumber(Number(ev.currentTarget.value)))
                }
            ></input>
            <button
                data-action="increment"
                className="bg-bgColor-primary hover:bg-bgColor-primary-hover text-textColor border-borderColor-primary hover:border-borderColor-hover border-l border-t border-b w-10 cursor-pointer outline-none"
                onClick={() => props.onChange(formatNumber((props.value ?? 0) + 1))}
            >
                <span className="m-auto text-1xl font-thin">+</span>
            </button>
            <button
                data-action="saveecovalue"
                className="bg-bgColor-primary hover:bg-bgColor-primary-hover text-textColor border-borderColor-primary hover:border-borderColor-hover border w-10 rounded-r cursor-pointer outline-none"
                onClick={() => props.onSaveValueToEco(formatNumber(props.value ?? 0))}
            >
                <span className="m-auto text-1xl font-thin"><svg xmlns="http://www.w3.org/2000/svg" height="20"
                                                                 viewBox="0 -960 960 960" width="24"><path
                    d="M160-160v-80h109q-51-44-80-106t-29-134q0-112 68-197.5T400-790v84q-70 25-115 86.5T240-480q0 54 21.5 99.5T320-302v-98h80v240H160Zm440 0q-50 0-85-35t-35-85q0-48 33-82.5t81-36.5q17-36 50.5-58.5T720-480q53 0 91.5 34.5T858-360q42 0 72 29t30 70q0 42-29 71.5T860-160H600Zm116-360q-7-41-27-76t-49-62v98h-80v-240h240v80H691q43 38 70.5 89T797-520h-81ZM600-240h260q8 0 14-6t6-14q0-8-6-14t-14-6h-70v-50q0-29-20.5-49.5T720-400q-29 0-49.5 20.5T650-330v10h-50q-17 0-28.5 11.5T560-280q0 17 11.5 28.5T600-240Zm120-80Z"/></svg></span>
            </button>
        </div>
    );
};
