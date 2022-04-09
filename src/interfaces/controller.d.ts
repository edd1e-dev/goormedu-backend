import { Router } from 'express';

interface IController {
  getRoute(): string;
  getRouter(): Router;
}
