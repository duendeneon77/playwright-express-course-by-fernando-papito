import { test, expect } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper,postTask } from './support/helpers'

test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Ler um livro de Typescrypt',
        is_done:false
    }

    await deleteTaskByHelper(request, task.name)


    await page.goto('http://localhost:8080')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(task.name)

    await page.click('css=button >> text=Create')

    const target = page.locator(`.task-item p:text-is("${task.name}")`)
    await expect(target).toBeVisible()
})

test('não deve permitir tarefa duplicada', async({page, request})=>{
    
    const task:TaskModel = {
        name:'Tarefa a duplicar',
        is_done:false
    }
    

    await deleteTaskByHelper(request, task.name)

    await postTask(request,task)
    
    await page.goto('http://localhost:8080')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(task.name)

    await page.click('css=button >> text=Create')


    const target = page.locator('.swal2-html-container')
    await expect(target).toHaveText('Task already exists!')
})