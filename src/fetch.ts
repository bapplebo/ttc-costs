import axios from 'axios';

export const fetchLua = async () => {
  const response = await axios.get(
    'https://raw.githubusercontent.com/chadvandy/groovy_ttc/refs/heads/master/script/ttc/ttc_vanilla_units.lua'
  );
  return response.data;
};
