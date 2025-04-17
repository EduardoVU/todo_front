const local = 'http://localhost:3000';
const cpanel = ''; 

export const url = `${local}/api`;

export const CONSTANTS = {
  GETTING_INFO: "GET_INFO",
  GET_INFO_SUCCESS: "GET_INFO_SUCCESS",
  GETTING_IMG: "GET_IMG",
  GET_IMG_SUCCESS: "GET_IMG_SUCCESS",
  SET_HISTORY_OPTION: "SET_HISTORY_OPTION",
  SET_ADDED: "SET_ADDED",
  SET_STATUS: "SET_STATUS",
  GETTING_MSG: "GETTING_MSG",
  GET_MSG: "GET_MSG",
  ERROR_MSG: "Ha ocurrido un error al intentar realizar la solicitud",
  SUCCESS_MSG: "Mensaje enviado con éxito",
  ERROR_STATUS: "error",
  SUCCESS_STATUS: "success",
  ERROR_INPUTS: "Campos no válidos",
  SUCCES_SUSCRIPTION: "Suscripción exitosa",
  SET_TOKEN: "SET_TOKEN", 
  SET_IDENTITY: "SET_IDENTITY", 
  GET_INFO_IDENTITY: "GET_INFO_IDENTITY",
  CLEAN_VALUE: "CLEAN_VALUE",
};

function createError(messageError: string, detail: any[] = []) {
  return {
    success: false,
    status: CONSTANTS.ERROR_STATUS,
    code: 500,
    message: messageError,
    data: null,
    detail,
  };
}

export function getErrorMessage(message: string | string[] | undefined): { success: boolean, status: string, code: number, message: string, data: null, detail: any[] } {
  if (!message) return createError(CONSTANTS.ERROR_MSG);

  if (Array.isArray(message)) {
    const stringErrors = message.map((err: any) => err.msg).join(', ');
    return createError(stringErrors, message);
  } else if (typeof message === 'string') {
    return createError(message);
  } else {
    return createError(CONSTANTS.ERROR_MSG);
  }
}
