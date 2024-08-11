package cn.tedu.nusplannerapi.base.exception;


import cn.tedu.nusplannerapi.base.response.JsonResult;
import cn.tedu.nusplannerapi.base.response.StatusCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.validation.ConstraintViolationException;

/**
 * ControllerAdvice注解: 标识当前的类为全局异常处理器类型;可以处理由控制器抛出的异常
 *   1.如果Controller中抛出了异常,首先看是否定义了全局异常处理器;
 *   2.如果定义了会在全局异常处理器中找对应的异常处理方法;
 *   3.如果找到了对应的异常处理方法,则执行异常处理方法中的代码逻辑.
 * RestControllerAdvice注解: 复合注解,相当于 @ResponseBody + @ControllerAdvise注解
 */
//@ControllerAdvice
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    /*
      ExceptionHandler注解:表示方法为具体的异常处理方法;需要一个异常处理类型的形式参数;
      1.优先查找该控制器异常对应的异常处理方法;
      2.如果没有对应的异常处理方法,则会找父类的异常处理方法;
      3.如果没有父类的异常处理方法,则会走SpringMVC自己的异常处理机制;
     */

    /* 处理业务层异常的方法 */
    @ExceptionHandler
    public JsonResult doHandleServiceException(ServiceException ex) {
        //如果抛出异常,在IDEA控制台打印错误异常日志
        log.error("RuntimeException: " + ex.getStatusCode().getMsg());
        //返回给前端错误状态码
        return new JsonResult(ex.getStatusCode());
    }

    /**
     * 第1个异常处理方法:IllegalArgumentException
     *
     * @param ex 异常对象
     * @return JsonResult
     */
    @ExceptionHandler
    public JsonResult doHandleIllegalArgumentException(IllegalArgumentException ex) {
        //获取异常提示消息: ex.getMessage() [微博ID值无效]
        String message = ex.getMessage();
        log.error("IllegalArgumentException: " + message);

        return new JsonResult(StatusCode.OPERATION_FAILED, message);
    }

    /**
     * 第2个异常处理方法:RuntimeException
     *
     * @param ex 异常处理对象
     * @return JsonResult
     */
    @ExceptionHandler
    public JsonResult doHandleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage();
        log.error("RuntimeException: " + message);

        return new JsonResult(StatusCode.OPERATION_FAILED, message);
    }

    /**
     * 第3个异常处理方法:MethodArgumentNotValidException
     * ------------专门处理POJO类型校验抛出的异常----------------
     * 1.Spring Validation框架抛出;
     * 2.校验POJO类属性时,参数未满足要求.
     */
    @ExceptionHandler
    public JsonResult doHandleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        //Validation中,验证POJO类型参数获取提示消息使用: ex.getFieldError().getDefaultMessage() 方法.
        String message = ex.getFieldError().getDefaultMessage();
        log.error("MethodArgumentNotValidException: " + message);

        return new JsonResult(StatusCode.VALIDATE_ERROR, message);
    }

    /**
     * 第4个异常处理方法:ConstraintViolationException
     * ------------专门处理声明参数方式验证框架校验抛出的异常----------------
     * 1.Spring Validation框架抛出;
     * 2.声明参数方式接收数据校验时,参数未满足要求.
     */
    @ExceptionHandler
    public JsonResult doHandleConstraintViolationException(ConstraintViolationException ex) {
        // selectById.id: 微博ID必须在200-500之间  ---->  微博ID必须在200-500之间
        String message = ex.getMessage().split(":")[1].trim();
        log.error("ConstraintViolationException: " + message);

        return new JsonResult(StatusCode.VALIDATE_ERROR, message);
    }

}
