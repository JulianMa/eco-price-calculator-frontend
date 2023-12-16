import classNames from 'classnames';
import {formatNumber} from '../../utils/helpers';
import Styles from './NumericInput.module.css';
import Tooltip from "../Tooltip/Tooltip";
import Button from "../Button/Button";
import {TooltipIcon} from "../Svg";
import {updatePriceInEcoStore} from "../../utils/restDbSdk";
import {useMainContext} from "../../hooks/MainContext";

type Props = {
    // this can either be a product name or a tag id. Use function getPersonalPriceId for ingredients or product.Name for products
    personalPriceId: string;
    class?: string;
};

export default (props: Props) => {
    const {get, loggedInUsernameResource} = useMainContext();
    const saveEcoValue = async (newValue: number) => {
        await updatePriceInEcoStore({ItemId: props.personalPriceId, NewPrice: newValue})
    }
    
    return loggedInUsernameResource && loggedInUsernameResource()?.username && (
        <div
            class={classNames(
                'flex',
                props.class
            )}
        >
            <Tooltip text="Update Ingame Shop-Prices of in Shops you are Authorized on. Applies for Buy and Sell Orders." noStyle>
                <button
                    data-action="saveecovalue"
                    className="flex bg-bgColor-primary hover:bg-bgColor-primary-hover text-textColor border-borderColor-primary hover:border-borderColor-hover border w-10 rounded cursor-pointer outline-none h-8"
                    onClick={() => saveEcoValue(formatNumber(get.personalPrice(props.personalPriceId) ?? 0))}
                >
                <span className="m-auto text-1xl font-thin text-lg"><svg xmlns="http://www.w3.org/2000/svg" height="20"
                                                                 viewBox="0 -960 960 960" width="24"><path
                    d="M160-160v-80h109q-51-44-80-106t-29-134q0-112 68-197.5T400-790v84q-70 25-115 86.5T240-480q0 54 21.5 99.5T320-302v-98h80v240H160Zm440 0q-50 0-85-35t-35-85q0-48 33-82.5t81-36.5q17-36 50.5-58.5T720-480q53 0 91.5 34.5T858-360q42 0 72 29t30 70q0 42-29 71.5T860-160H600Zm116-360q-7-41-27-76t-49-62v98h-80v-240h240v80H691q43 38 70.5 89T797-520h-81ZM600-240h260q8 0 14-6t6-14q0-8-6-14t-14-6h-70v-50q0-29-20.5-49.5T720-400q-29 0-49.5 20.5T650-330v10h-50q-17 0-28.5 11.5T560-280q0 17 11.5 28.5T600-240Zm120-80Z"/></svg></span>
                </button>
            </Tooltip>

        </div>
    );
};
