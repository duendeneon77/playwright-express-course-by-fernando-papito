import { test, expect } from '@playwright/test'


test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
    const taskName = 'Ler um livro de TypeScript'

    const response = await request.delete(
        `http://localhost:3333/helper/tasks/${encodeURIComponent(taskName)}`
    )

    console.log('Status DELETE:', response.status())

    expect(response.status()).toBe(204)

    await page.goto('http://localhost:8080')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(taskName)

    await page.click('css=button >> text=Create')

    const target = page.locator(`.task-item p:text-is("${taskName}")`)
    await expect(target).toBeVisible()
})

test('não deve permitir tarefa duplicada', async({page, request})=>{
    
    const task = {
        name:'Tarefa a duplicar',
        is_done:false
    }
    
    await request.delete(
        `http://localhost:3333/helper/tasks/${encodeURIComponent(task.name)}`
    )
    const newTask = await request.post('http://localhost:3333/tasks', {data: task})

    expect(newTask.ok()).toBeTruthy()
    
    await page.goto('http://localhost:8080')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(task.name)

    await page.click('css=button >> text=Create')


    const target = page.locator('.swal2-html-container')
    await expect(target).toHaveText('Task already exists!')
})