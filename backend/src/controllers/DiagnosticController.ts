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
        },
        client_answers: {
          select: {
            score: true,
            response: true
          },
          orderBy: {
            created_at: "desc"
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

export const getDiagnostic = async (req: any, res: Response) => {
  try {
    const { id: diagnosticId } = req.params;
    const { id: userId } = req.user;
    // find tasks
    const diagnostics = await prisma.diagnostic.findUnique({
      where: {
        id: diagnosticId
      },
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

export const answerDiagnostic = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { answers } = req.body;
    // get diagnostic
    const diagnostic = await prisma.diagnostic.findUnique({
      where: {
        id
      }
    });
    if (!diagnostic) {
      return res.status(400).json({ message: "Diagnóstico não encontrado" });
    }
    // get answers and notes
    const questions = await prisma.questions.findMany({
      where: {
        diagnosticId: id
      },
      select: {
        title: true,
        answers: {
          select: {
            title: true,
            score: true
          }
        }
      }
    });
    // avaliação
    let maxScore = 0;
    let notas = [];
    let i = 0;
    for (const question of questions) {
      maxScore += question.answers.length;
      const findAnswer = question.answers.find(
        (x: any) => x.title === answers[i]
      );
      if (findAnswer) {
        notas.push(findAnswer.score);
      } else {
        notas.push(null);
      }
      i++;
    }
    // calcula a nota
    const totalUserScore = notas.reduce(
      (acc: number, score: any) => acc + score,
      0
    );
    const pontuacaoFinal = Math.round(totalUserScore / maxScore * 100);
    // update note
    const saveAnswers = await prisma.clientAnswers.create({
      data: {
        userId,
        diagnosticId: id,
        score: pontuacaoFinal || 0,
        response: answers
      }
    });
    return res.status(200).json(saveAnswers);
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

export const deleteDiagnostic = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    const findTask = await prisma.diagnostic.findUnique({
      where: {
        id
      }
    });
    if (!findTask) {
      return res.status(400).json({ message: "Diagnóstico não encontrado" });
    }
    // delete answers
    const quests = await prisma.questions.findMany({
      where: {
        diagnosticId: id
      }
    });
    // delete questions
    for (const qs of quests) {
      await prisma.answers.deleteMany({
        where: {
          questionId: qs.id
        }
      });
    }
    await prisma.questions.deleteMany({
      where: {
        diagnosticId: id
      }
    });
    // delete diagnostic
    const task = await prisma.diagnostic.delete({
      where: {
        id
      }
    });
    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};
