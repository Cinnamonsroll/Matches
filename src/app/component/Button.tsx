import { motion } from "framer-motion";

interface ButtonProps {
    disabled: boolean;
    text: string;
    type: string;
    onClick: (type: string) => void;
}

const Button: React.FC<ButtonProps> = ({ disabled, text, type, onClick }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={disabled}
            className="bg-secondary border border-pborder disabled:bg-gray-500/30 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded mx-2"
            onClick={() => onClick(type)}
        >
            {text}
        </motion.button>
    );
};

export default Button;
