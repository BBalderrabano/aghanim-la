import { useTranslation } from 'react-i18next';

import Loading from '../../components/Loading';

import useAxios from '../../hooks/useAxios';
import axios from '../../api/aghanim';

import useAuth from '../../hooks/useAuth';

import './Profile.css';
import ItemLevelDisplay from '../../components/inputs/ItemLevelDisplay';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Profile = () => {
    const { t } = useTranslation("common", "profile");

    const { auth } = useAuth();

    const [user, error, loading, refetch] = useAxios({
        axiosInstance: axios,
        method: 'GET',
        url: `/user/${auth._id}`
    });

    return (
        <div className="table-wrapper">
            <div className="table-title">
                <div className="row">
                    <div className="col-sm-6">
                        <h2>
                            {t('manage')} <b>{t('profile')}</b>
                        </h2>
                    </div>
                </div>
            </div>
            <>
                {loading && <Loading />}
                {!loading && error && <p className="errMsg">{error}</p>}
                {!loading && !error && user &&
                    <fieldset className='border p-2 profile-fieldset'>
                        <legend className='w-auto profile-legend'>
                            <h2 style={{ display: 'flex' }}>
                                <span style={{ color: '#435d7d' }}>{user?.username}&nbsp;</span>
                                <span style={{ color: 'lightgray' }}>({user?.laclass?.classname})&nbsp;</span>
                                -&nbsp;
                                <ItemLevelDisplay
                                    user_id={user?._id}
                                    itemlevel={user?.itemlevel}
                                    disabled={0}
                                    showTooltip={true}
                                    handleUpdate={() => refetch()} />
                            </h2>
                        </legend>
                        <div className='profile-container'>
                            {
                                user.alters ?
                                    null
                                    :
                                    <>
                                        <h4>{t('no-alters-question', { ns: 'profile' })}</h4>
                                        <div className="col-sm-6">
                                            <button
                                                className="btn btn-success"
                                                disabled={loading}
                                            >
                                                <AddCircleOutlineIcon />
                                                <span>Add alter</span>
                                            </button>
                                        </div>
                                    </>
                            }


                        </div>
                    </fieldset>
                }
                {!loading && !error && !user && <p className='errMsg'>{t('nodisplaydata')}</p>}
            </>
        </div>
    )
}

export default Profile;