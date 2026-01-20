// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 生成随机序号
    generateSerialNumber();

    // 表单验证
    setupFormValidation();

    // 进度追踪
    setupProgressTracking();

    // 按钮事件
    setupButtonEvents();
});

// 生成序号
function generateSerialNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const serialNumber = `EXP${year}${month}${day}${randomNum}`;
    document.getElementById('serialNumber').value = serialNumber;
}

// 表单验证设置
function setupFormValidation() {
    const requiredFields = document.querySelectorAll('.required');

    requiredFields.forEach(field => {
        const input = field.parentElement.querySelector('.form-control, select, input[type="radio"]:checked, textarea');

        if (input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '';
                }
            });
        }
    });
}

// 验证单个字段
function validateField(field) {
    if (!field.value.trim()) {
        field.style.borderColor = 'var(--danger-color)';
        return false;
    } else {
        field.style.borderColor = '';
        return true;
    }
}

// 进度追踪
function setupProgressTracking() {
    const sections = document.querySelectorAll('.form-card');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const statusIcons = document.querySelectorAll('.sidebar-card .info-item .info-value i');

    // 检查每个部分的完成情况
    function checkProgress() {
        let completedSections = 0;

        sections.forEach((section, index) => {
            const requiredFields = section.querySelectorAll('.required');
            let completedFields = 0;

            requiredFields.forEach(field => {
                const input = field.parentElement.querySelector('.form-control, select, input[type="radio"]:checked, textarea');
                if (input && input.value.trim()) {
                    completedFields++;
                }
            });

            // 如果该部分所有必填字段都已完成，则标记为完成
            if (requiredFields.length > 0 && completedFields >= requiredFields.length * 0.8) {
                completedSections++;
                if (statusIcons[index]) {
                    statusIcons[index].className = 'fas fa-check-circle';
                    statusIcons[index].style.color = 'var(--success-color)';
                }
            } else {
                if (statusIcons[index]) {
                    statusIcons[index].className = 'far fa-circle';
                    statusIcons[index].style.color = '#cbd5e1';
                }
            }
        });

        // 更新进度条
        const progress = Math.round((completedSections / sections.length) * 100);
        progressFill.style.width = `${progress}%`;
        progressPercent.textContent = `${progress}%`;
    }

    // 为所有输入添加事件监听
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', checkProgress);
        input.addEventListener('change', checkProgress);
    });

    // 初始化进度
    checkProgress();
}

// 按钮事件设置
function setupButtonEvents() {
    const resetBtn = document.getElementById('resetBtn');
    const saveBtn = document.getElementById('saveBtn');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const messageText = document.getElementById('messageText');

    // 重置表单
    resetBtn.addEventListener('click', function() {
        if (confirm('确定要重置表单吗？所有已填写的信息都将被清除。')) {
            document.querySelectorAll('input:not(#serialNumber), select, textarea').forEach(input => {
                if (input.type === 'radio' || input.type === 'checkbox') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });

            // 重置单选按钮为默认值
            document.querySelectorAll('input[type="radio"]').forEach(radio => {
                if (radio.name === 'isEnterpriseRep' && radio.value === 'no') radio.checked = true;
                if (radio.name === 'changedOrg' && radio.value === 'no') radio.checked = true;
                if (radio.name === 'majorProjectExpert' && radio.value === 'no') radio.checked = true;
            });

            // 重置下拉框
            document.querySelectorAll('select').forEach(select => {
                select.selectedIndex = 0;
            });

            // 重新生成序号
            generateSerialNumber();

            // 重新检查进度
            setupProgressTracking();

            alert('表单已重置！');
        }
    });

    // 保存草稿
    saveBtn.addEventListener('click', function() {
        // 这里应该添加实际的保存逻辑
        messageText.textContent = '草稿保存成功！';
        successMessage.style.backgroundColor = 'var(--primary-color)';
        successMessage.style.display = 'block';

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    });

    // 提交表单
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 验证所有必填字段
        const requiredFields = document.querySelectorAll('.required');
        let isValid = true;
        let firstInvalidField = null;

        requiredFields.forEach(field => {
            const input = field.parentElement.querySelector('.form-control, select, input[type="radio"]:checked, textarea');
            if (!input || !input.value.trim()) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = input;
                }

                if (input && input.classList.contains('form-control')) {
                    input.style.borderColor = 'var(--danger-color)';
                }
            }
        });

        if (!isValid) {
            alert('请完成所有必填字段（标有*的字段）');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }
            return;
        }

        // 确认提交
        if (confirm('确认提交专家信息吗？提交后信息将进入审核流程。')) {
            // 这里应该添加实际的提交逻辑
            messageText.textContent = '信息提交成功！';
            successMessage.style.backgroundColor = 'var(--success-color)';
            successMessage.style.display = 'block';

            // 禁用提交按钮
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> 已提交';
            submitBtn.style.backgroundColor = '#ccc';

            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);

            // 模拟表单提交
            setTimeout(() => {
                alert('感谢您提交专家信息！我们将尽快审核您的资料。');
                // 跳转到成功页面
                window.location.href = 'test.html';
            }, 1000);
        }
    });
}

// 辅助函数：格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 辅助函数：验证邮箱格式
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 辅助函数：验证手机号格式
function validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// 辅助函数：验证身份证号格式
function validateIdNumber(idNumber) {
    const idRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/;
    return idRegex.test(idNumber);
}