import i18n, { LocaleObject } from 'i18n';
import { NextFunction, Request, Response } from 'express';
import path from 'path';

i18n.configure({
  locales: ['en'],
  directory: path.join(path.dirname(__dirname), '/locales'),
  defaultLocale: 'en',
  queryParameter: 'lang',
  cookie: 'locale',
  objectNotation: true,
});

const useI18nMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  i18n.init(req, res);
  res.locals.__ = (key: string, options?: LocaleObject) =>
    i18n.__({ phrase: key, locale: req.locale, ...options });
  res.locals.__n = (key: string, count: number, options?: LocaleObject) =>
    i18n.__n({
      singular: key,
      plural: key,
      count,
      locale: req.locale,
      ...options,
    });
  return next();
};
export default useI18nMiddleware;
