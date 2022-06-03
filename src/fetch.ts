import axios from 'axios';

export const fetchLua = async () => {
  const response = await axios.get(
    'https://raw.githubusercontent.com/DrunkFlamingo/DrunkFlamingo_TotalWarMods/master/warhammer_3/df_tabletopcaps/script/ttc/ttc_vanilla_units.lua'
  );
  return response.data;
};
