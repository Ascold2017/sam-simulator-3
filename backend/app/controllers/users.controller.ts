import type { UserListResponse } from "../types/user.model";
import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService = new UserService();

  public getUsers() {
    return async (req: Request, res: Response) => {
      // Получаем миссии из базы данных
      const users = await this.userService.getAllUsers();

      res.status(200).json(users satisfies UserListResponse);
    };
  }

  public pathcUserPremium() {
    return async (req: Request, res: Response) => {
      await this.userService.setUserPremium(+req.params.id, req.body.isPremium);
      res.status(200).json();
    };
  }

  public patchUserRole() {
    return async (req: Request, res: Response) => {
      await this.userService.setUserRole(+req.params.id, req.body.role);
      res.status(200).json();
    };
  }
  
  public deleteUser() {
    return async (req: Request, res: Response) => {
      await this.userService.deleteUser(+req.params.id);
      res.status(200).json();
    };
  }
}
