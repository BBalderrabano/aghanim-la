import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { getEnabledClasses } from "../../api/classes";
import Select from "react-select";

const ClassesSelector = ({ onValueChange }) => {
  const { t } = useTranslation(['common']);

  const [isLoading, setIsLoading] = useState(true);

  const [dropdownValue, setDropdownValue] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const getAll = async () => {
      try {
        await getEnabledClasses()
          .then((res) => {
            if (res.error) {
              console.error(res.error);
            } else {
              const selectOptions = res.map((a) => ({
                label: a.classname,
                value: a._id,
              }));
              setDropdownValue(selectOptions);
            }
          })
          .catch((err) => console.error(err));
      } catch (e) {
        console.error(e);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    getAll();

    return () => (isMounted = false);
  }, []);

  return <Select
    placeholder={t('classelect')}
    menuPlacement="auto"
    styles={{
      menu: base => ({
        ...base,
        zIndex: 100
      })
    }}
    onChange={onValueChange}
    isDisabled={isLoading}
    options={dropdownValue} />;
};

ClassesSelector.propTypes = {
  onValueChange: PropTypes.func.isRequired
}

export default ClassesSelector;
