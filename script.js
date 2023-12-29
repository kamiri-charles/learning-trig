document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById("canvas");
	canvas.width = 500;
	canvas.height = 500;
	/** @type {CanvasRenderingContext2D} */
	const ctx = canvas.getContext("2d");
	
	const chart_canvas = document.getElementById("chart-canvas");
	chart_canvas.width = 500;
	chart_canvas.height = 100;
	/** @type {CanvasRenderingContext2D} */
	const chart_ctx = chart_canvas.getContext("2d");
	
	const offset = {
		x: canvas.width * 0.5,
		y: canvas.height * 0.5,
	};
	
	const chart_offset = {
		x: chart_canvas.width * 0.5,
		y: chart_canvas.height * 0.5,
	};

	let theta = Math.PI / 4;
	const c = 100;
	
	ctx.translate(offset.x, offset.y);
	chart_ctx.translate(chart_offset.x, chart_offset.y);
	
	
	const A = { x: 0, y: 0 };
	const B = { x: Math.cos(theta) * c, y: Math.sin(theta) * c };
	const C = { x: B.x, y: 0 };
	
	const draw_point = (loc, size = 20, color = "black") => {
		chart_ctx.beginPath();
		chart_ctx.fillStyle = color;
		chart_ctx.arc(loc.x, loc.y, size * 0.5, 0, Math.PI * 2);
		chart_ctx.fill();
	};
	
	const draw_text = (text, loc, color = "black") => {
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "bold 18px Courier";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 7;
		ctx.strokeText(text, loc.x, loc.y);
		ctx.fillText(text, loc.x, loc.y);
	};
	
	const draw_line = (start, end, color = "black") => {
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
	};
	
	const draw_cors_system = (context, offset) => {
		context.beginPath();
		context.moveTo(-offset.x, 0);
		context.lineTo(canvas.width - offset.x, 0);
		context.moveTo(0, -offset.y);
		context.lineTo(0, canvas.height - offset.y);
		context.setLineDash([4, 2]);
		context.lineWidth = 1;
		context.strokeStyle = "gray";
		context.stroke();
		context.setLineDash([]);
	};
	
	const average = (point_1, point_2) => ({
		x: (point_1.x + point_2.x) * 0.5,
		y: (point_1.y + point_2.y) * 0.5,
	});
	
	const distance = (point_1, point_2) => Math.hypot(point_1.x - point_2.x, point_1.y, -point_2.y);
	
	const toDeg = (rad) => (rad * 180) / Math.PI;

	const update = () => {
		const sin =Math.sin(theta);
		const cos = Math.cos(theta);
		const tan = Math.tan(theta);

		ctx.clearRect(-offset.x, -offset.y, canvas.width, canvas.height);
		
		draw_cors_system(ctx, offset);
		
		draw_text(
			"sin = a/c = " + sin.toFixed(2),
			{ x: -offset.x * 0.5, y: offset.y * 0.7 },
			"red"
			);
			
		draw_text(
			"cos = b/c = " + cos.toFixed(2),
			{ x: -offset.x * 0.5, y: offset.y * 0.8 },
			"blue"
			);
				
		draw_text(
			"tan = a/b = " + tan.toFixed(2),
			{ x: -offset.x * 0.5, y: offset.y * 0.9 },
			"magenta"
			);
					
		draw_text(
			"0 = " +
			sin.toFixed(2) +
			" (" +
			Math.round(toDeg(theta)).toString().padStart(2, " ") +
			"°)",
			{ x: offset.x * 0.5, y: offset.y * 0.7 }
			);
						
		draw_line(A, B);
		draw_text("c", average(A, B));
		
		draw_line(A, C, "blue");
		draw_text("b", average(A, C), "blue");
		
		draw_line(B, C, "red");
		draw_text("a", average(B, C), "red");
		
		draw_text("0", A);
		
		ctx.beginPath();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		const start = B.x > A.x ? 0 : Math.PI;
		const clockwise = (B.y < C.y) ^ (B.x > A.x);
		let end = B.y < C.y ? -theta : theta;
		if (B.x < A.x) {
			end = Math.PI - end;
		}
		ctx.arc(0, 0, 20, start, end, !clockwise);
		ctx.stroke();


		const chart_scaler = chart_offset.y;
		draw_point(
			{ x: theta * chart_scaler, y: sin * chart_scaler },
			2,
			'red'
		);

		draw_point(
			{ x: theta * chart_scaler, y: cos * chart_scaler },
			2,
			'blue'
		);

		draw_point(
			{ x: theta * chart_scaler, y: tan * chart_scaler },
			2,
			'magenta'
		);
	};
					
	document.onmousemove = (evt) => {
		B.x = evt.offsetX - offset.x;
		B.y = evt.offsetY - offset.y;
		
		C.x = B.x;
		
		update();
	};

	draw_cors_system(chart_ctx, chart_offset);
	
	update();
});