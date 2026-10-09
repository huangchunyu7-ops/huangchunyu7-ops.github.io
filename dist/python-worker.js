import {loadPyodide} from './vendor/pyodide/pyodide.mjs';
// Python runs off the UI thread. Files are fixtures inside the browser runtime.
let python;
self.onmessage=async({data})=>{
 if(data.type==='init'){
  try{python=await loadPyodide({indexURL:new URL('./vendor/pyodide/',import.meta.url).href});self.postMessage({type:'ready'});}catch(e){self.postMessage({type:'init-error',error:String(e.message)});}return;
 }
 if(data.type!=='run'||!python)return;
 try{
  const dir='/home/pyclass';if(!python.FS.analyzePath(dir).exists)python.FS.mkdir(dir);python.FS.chdir(dir);
  python.FS.writeFile(dir+'/app.log','INFO started\nERROR database timeout\nINFO retry\nERROR upstream failed\n');
  python.FS.writeFile(dir+'/health.json','[{"service":"nginx","status":200},{"service":"order-api","status":503},{"service":"report-api","status":502}]');
  if(python.FS.analyzePath(dir+'/report.txt').exists)python.FS.unlink(dir+'/report.txt');
  python.globals.set('_lesson_request',JSON.stringify(data));
  const result=python.runPython(`
import json as _json, io as _io, contextlib as _contextlib, ast as _ast, traceback as _traceback
def _evaluate_lesson(payload):
    class CappedOutput(_io.StringIO):
        def write(self, text):
            if self.tell() + len(text) > 12000:
                raise RuntimeError("输出超过 12000 字，请缩小循环或输出范围。")
            return super().write(text)
    out = CappedOutput()
    namespace = {"__name__": "__main__"}
    result = {"ok": False, "passed": False, "output": "", "error": "", "feedback": ""}
    try:
        tree = _ast.parse(payload["code"], filename="课堂代码")
        with _contextlib.redirect_stdout(out), _contextlib.redirect_stderr(out):
            exec(compile(tree, "课堂代码", "exec"), namespace)
        result["ok"] = True
        result["output"] = out.getvalue()
        nodes = {type(node).__name__ for node in _ast.walk(tree)}
        syntax = payload.get("syntax", [])
        syntax_ok = not syntax or any(name in nodes for name in syntax)
        values_ok = all(bool(eval(check, namespace)) for check in payload["checks"])
        output_ok = result["output"].strip() == payload["expected"].strip()
        result["passed"] = syntax_ok and values_ok and output_ok
        result["feedback"] = "运行与任务校验通过，请先确认输出。" if result["passed"] else ("代码运行了，但尚未完成当前任务。对照目标、变量与预期输出修改。" if syntax_ok else "结果相似，但请使用本课要求的代码结构完成练习。")
    except BaseException as error:
        result["output"] = out.getvalue()
        result["error"] = "".join(_traceback.format_exception(type(error), error, error.__traceback__))[-4000:]
        result["feedback"] = "尚未通过。先看错误类型与课堂代码行号，再修改重试。"
    return _json.dumps(result, ensure_ascii=False)
_evaluate_lesson(_json.loads(_lesson_request))
`);
  self.postMessage({type:'result',id:data.id,...JSON.parse(result)});
 }catch(e){self.postMessage({type:'result',id:data.id,ok:false,passed:false,output:'',error:String(e.message),feedback:'运行失败，请重新尝试。'});}
};
