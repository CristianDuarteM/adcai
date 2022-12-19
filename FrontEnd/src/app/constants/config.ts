export class config {
  public static API_URL = 'https://adcai-backend-production.up.railway.app';
  public static SESSION_STORAGE = {
    TOKEN_GOOGLE: 'tokenGoogle',
    TOKEN: 'token',
    ACTIVE_ROLE: 'activeRole',
    IS_COMPLETE: 'isComplete',
    ID_USER: 'idUser',
    UNREAD_NOTIFICATIONS: 'unreadNotifications'
  };
  public static STATES_CAI = {
    1: 'DILIGENCIADO',
    2: 'APROBADO DIRECTOR',
    3: 'APROBADO DECANO',
    4: 'RECHAZADO DECANO',
    5: 'RECHAZADO DIRECTOR',
  };
  public static LIMIT_BASE_HOURS = 40;
}
