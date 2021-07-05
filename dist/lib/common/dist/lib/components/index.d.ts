/// <reference types="@solana/web3.js" />
/// <reference types="@solana/spl-token/node_modules/@solana/web3.js" />
/// <reference types="@solana/spl-token-swap/node_modules/@solana/web3.js" />
export var __esModule: boolean;
export var ExplorerLink: (props: {
    address: string | import("@solana/web3.js").PublicKey;
    type: string;
    code?: boolean | undefined;
    style?: React.CSSProperties | undefined;
    length?: number | undefined;
    short?: boolean | undefined;
    connection?: import("@solana/web3.js").Connection | undefined;
}) => JSX.Element | null;
export var ConnectButton: (props: index_2.ConnectButtonProps) => JSX.Element;
export var CurrentUserBadge: (props: {
    showBalance?: boolean | undefined;
    showAddress?: boolean | undefined;
    iconSize?: number | undefined;
}) => JSX.Element | null;
export var Identicon: (props: {
    address?: string | import("@solana/web3.js").PublicKey | undefined;
    style?: React.CSSProperties | undefined;
    className?: string | undefined;
}) => JSX.Element;
export var Info: (props: {
    text: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    style?: React.CSSProperties | undefined;
}) => JSX.Element;
export var NumericInput: typeof numeric_1.NumericInput;
export var AppBar: (props: {
    left?: JSX.Element | undefined;
    right?: JSX.Element | undefined;
    useWalletBadge?: boolean | undefined;
    additionalSettings?: JSX.Element | undefined;
}) => JSX.Element;
export var Settings: ({ additionalSettings, }: {
    additionalSettings?: JSX.Element | undefined;
}) => JSX.Element;
export var ActionConfirmation: (props: {
    className?: string | undefined;
    onClose: () => void;
}) => JSX.Element;
export var BackButton: () => JSX.Element;
export var TokenIcon: (props: {
    mintAddress?: string | import("@solana/web3.js").PublicKey | undefined;
    style?: React.CSSProperties | undefined;
    size?: number | undefined;
    className?: string | undefined;
    tokenMap?: import("..").KnownTokenMap | undefined;
}) => JSX.Element;
export var TokenDisplay: (props: {
    name: string;
    mintAddress: string;
    icon?: JSX.Element | undefined;
    showBalance?: boolean | undefined;
}) => JSX.Element;
export var EtherscanLink: (props: {
    address: string;
    type: string;
    code?: boolean | undefined;
    style?: React.CSSProperties | undefined;
    length?: number | undefined;
}) => JSX.Element | null;
import index_2 = require("./ConnectButton/index");
import numeric_1 = require("./Input/numeric");
//# sourceMappingURL=index.d.ts.map