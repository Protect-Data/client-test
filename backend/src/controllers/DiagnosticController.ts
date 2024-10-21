import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const allDiagnostics = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    // check manager
    const checkManager = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        manager: true
      }
    });
    // where condition
    const _where = checkManager && checkManager.manager ? {} : {};
    // find tasks
    const diagnostics = await prisma.diagnostic.findMany({
      where: _where,
      select: {
        id: true,
        title: true,
        created_at: true,
        questions: {
          select: {
            id: true,
            title: true,
            descr: true,
            answers: true
          }
        }
      }
    });

    if (!diagnostics) {
      return res.status(204);
    }

    return res.status(200).json(diagnostics);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const addDiagnostic = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { title, questions } = req.body;
    // check manager
    const checkManager = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        manager: true
      }
    });
    // find tasks
    const diagnostics = await prisma.diagnostic.create({
      data: {
        title,
        questions: {
          create: questions.map((question: any) => ({
            title: question.title,
            descr: question.descr,
            answers: {
              create: question.answers.map((answer: any) => ({
                title: answer.title,
                score: parseInt(answer.score)
              }))
            }
          }))
        }
      }
    });

    if (!diagnostics) {
      return res.status(204);
    }

    return res.status(200).json(diagnostics);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const editDiagnostic = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { id: diagnosticId } = req.params;
    const { title, questions } = req.body;
    // check manager
    const checkManager = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        manager: true
      }
    });
    // find tasks
    await prisma.answers.deleteMany({
      where: {
        question: {
          diagnosticId
        }
      }
    });
    // Deleta perguntas associadas ao diagnóstico
    await prisma.questions.deleteMany({
      where: { diagnosticId }
    });
    const diagnostics = await prisma.diagnostic.update({
      where: {
        id: diagnosticId
      },
      data: {
        title,
        questions: {
          create: questions.map((question: any) => ({
            title: question.title,
            descr: question.descr,
            answers: {
              create: question.answers.map((answer: any) => ({
                title: answer.title,
                score: parseInt(answer.score)
              }))
            }
          }))
        }
      }
    });

    if (!diagnostics) {
      return res.status(204);
    }

    return res.status(200).json(diagnostics);
  } catch (error) {
    return res.status(400).json(error);
  }
};
