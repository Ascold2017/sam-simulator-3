import type { UserListResponse } from "../../../shared/admModels/user.model";
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
}
