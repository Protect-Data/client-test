import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { createLog } from "../services/logs.service";

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
            created_at: true,
            id: true,
            score: true,
            response: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
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
    let mustAvaliation = false;
    let maxScore = 0;
    let notas = [];
    let i = 0;
    for (const question of questions) {
      maxScore += question.answers.length;
      if (question.answers.length <= 0) {
        mustAvaliation = true;
      }
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
        score: mustAvaliation ? 0 : pontuacaoFinal,
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

export const rateDiagnostic = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { caId } = req.query;
    const { id: userId } = req.user;
    const { answers } = req.body;
    // is admin
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
      maxScore += 3;
      const findAnswer = question.answers.find(
        (x: any) => x.title === answers[i]
      );
      if (findAnswer) {
        notas.push(findAnswer.score);
      } else {
        // add a nota enviada no gabarito
        notas.push(answers[i]);
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
    const saveAnswers = await prisma.clientAnswers.update({
      where: {
        id: caId
      },
      data: {
        score: pontuacaoFinal
      }
    });
    return res.status(200).json(saveAnswers);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const generateTaskDiagnostic = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { title, tasks } = req.body;
    // is admin
    // create the task
    const task = await prisma.task.create({
      data: {
        title,
        description: `Tarefa importada do Diagnóstico ${title}`,
        status: 0,
        privacy: "public",
        user: { connect: { id: userId } },
        checklist: {
          create: tasks.map((item: any) => ({
            title: `[${item.question}]: ${item.answer}`,
            status: 0,
            user: { connect: { id: userId } }
          }))
        }
      },
      select: {
        id: true,
        title: true,
        status: true,
        privacy: true,
        description: true
      }
    });

    if (task.id) {
      await createLog(`Tarefa importada de ${title}`, userId, task.id);
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(400).json(error);
  }
};
