import chalk from 'chalk';

class generateJS{
    constructor(page) {
        this.url = "http://127.0.0.1:5500/templates/admin_interface.html"
        this.page = page;
        this.title = '#title';
        this.xTitle = '#xTitle'; 
        this.yTitle = '#yTitle';
        this.scaleMax = '#scaleMax';
        this.scaleMin = '#scaleMin';
        this.scaleIncrement = '#scaleIncrement';
        this.stepSize = '#stepSize';
        this.totalSum = '#totalSum';
        this.submitButton = '#submitButton';
    }
    async testJS(title, xTitle){//,/yTitle, max, min, scale, step, totalSum,){
        try{
            await this.page.goto(this.url);
    
            await this.page.type(this.titleField, title);
            await this.page.waitFor(1000);
            await this.page.type(this.xTitleField, xTitle);
            await this.page.waitFor(1000);
            /**await this.page.type(this.yTitleField, yTitle);
            await this.page.waitFor(1000);
            await this.page.type(this.maxField, max);
            await this.page.waitFor(1000);
            await this.page.type(this.minField, min);
            await this.page.waitFor(1000);
            await this.page.type(this.scaleField, scale);
            await this.page.waitFor(1000);
            await this.page.type(this.stepField, step);
            await this.page.waitFor(1000);
            await this.page.type(this.totalSumField, totalSum);
            await this.page.waitFor(1000);
            **/
            await this.page.click(this.submitButton);
            await this.page.waitFor(1000);
    
            const scriptJS = await navigator.clipboard.readText();
    
            return scriptJS;
    
        } catch (err) {
            console.log(chalk.red('ERROR => ', err));
        }
    }   
}

export default (page) => new generateJS(page);
