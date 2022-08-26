import Input from "react-bootstrap/FormControl";

const NumericInput = ({ ...rest }) => {
    const checkForOnlyNumbers = (e) => {
        if (!isSpecialKey(e.keyCode)) {
            if (/\D/g.test(e.key) || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(e.key)) {  // eslint-disable-line
                e.preventDefault();
            }
        }
    }

    const isSpecialKey = (keyCode) => {
        return keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39;
    }
    
    return (
        <Input {...rest}
            onKeyDown={(e) => checkForOnlyNumbers(e)}
        />
    )
}

export default NumericInput;