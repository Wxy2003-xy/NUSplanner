package cn.tedu.nusplannerapi.base.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
/**
 * 车辆申请单状态枚举类
 * 枚举的定义顺序：先列出枚举常量，然后是它们的共有属性
 * 在@AllArgsConstructor注解的情况下，Lombok会为枚举生成一个带有所有字段的全参数构造器。
 * 将字段放在枚举常量之后意味着这些字段将成为构造器的参数，当初始化每个枚举常量时，会使用这些参数来设置对应的值。
 */
public enum ApplicationStatusEnum {
    PENDING("10","已发起"),
    CANCEL("20","撤销"),
    AUDIT("30","审核中"),
    REJECT("40","驳回"),
    AUDITED("50","已审核"),
    ALLOCATION("60","已分配用车"),
    END("70","工单结束");

    private String code;
    private String msg;
}
