import { ChangeEvent, FocusEvent, useState } from "react";

const useInput = (inputValidation: (value:string) => boolean) => {
    const [enteredValue, setEnteredValue] = useState<string>("");
    const [isTouched, setIsTouched] = useState<boolean>(false);

    const hasError = !inputValidation(enteredValue) && isTouched; 

    const blurHandler = (event: FocusEvent<HTMLInputElement>) => {
        setIsTouched(true);
    }

    const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setEnteredValue(event.target.value);
    }

    const resetInput = () =>{
        setIsTouched(false);
        setEnteredValue("");
    }

    return {
        value: enteredValue,
        hasError: hasError,
        blurHandler,
        inputHandler,
        reset: resetInput,
        isValid: inputValidation(enteredValue)
    };
};

export default useInput;
