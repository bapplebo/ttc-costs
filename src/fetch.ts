import axios from 'axios';

export const fetchLua = async () => {
  const response = await axios.get(
    'https://raw.githubusercontent.com/DrunkFlamingo/df_wh3_mods/master/script/campaign/mod/ttc_vanilla_units.lua'
  );
  return response.data;
};
