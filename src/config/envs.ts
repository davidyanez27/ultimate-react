import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  //Auth
  JWT_SEED: get('JWT_SEED').required().asString(),


}